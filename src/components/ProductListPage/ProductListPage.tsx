import { useCallback, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { listProducts, getCategories, searchProducts } from "../../api/services"; // Adjust import path
import useInfiniteScroll from "../../hooks/useInfiniteScroll"; // Adjust import path
import { useNavigate } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";

interface Product {
  id: string;
  title: string;
  price: number;
  category: Category; 
}

interface Category {
  id: string;
  name: string;
}

export const ProductListPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [query, setQuery] = useState<string>("");

  let navigate = useNavigate();

  const {
    data: products,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: ({ pageParam = 0 }) => listProducts(pageParam, 10),
    getNextPageParam: (lastPage, allPages) => {
      const nextOffset = allPages.length * 10;
      return lastPage.length === 10 ? nextOffset : undefined;
    },
    initialPageParam: 0,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const debouncedSearch = useDebounce((searchQuery: string) => {
    if (searchQuery) {
      console.log(searchProducts(searchQuery))
    }
  }, 500);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  const observerRef = useInfiniteScroll(
    hasNextPage ? fetchNextPage : () => {},
    {
      root: null,
      rootMargin: "100px",
      threshold: 1,
      once: false,
      debounceDelay: 300,
    }
  );

  if (isFetching && !products) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;
  if (!products) return <div>No data available</div>;

  const getFilteredProducts = () => {
    if (selectedCategory === "All") {
      return products.pages;
    }

    return products.pages.map((page) =>
      page.filter((product: Product) => {
        return String(product.category.id) === String(selectedCategory);
      })
    );
  };

  return (
    <div>
      <h1>Product List</h1>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="All">All</option>
        {categories?.map((category: Category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={query}
        onChange={handleSearchChange}
        placeholder="Search products"
      />
      <div className="products-grid">
        {getFilteredProducts().map((page, i) => (
          <div key={i}>
            {page.map((product: Product) => (
              <div key={product.id} className="product-card">
                <h2>
                  {product.id}. {product.title}: ${product.price}
                </h2>
                <p>
                  Category: {product.category.name}
                </p>
                <div>
                  <button onClick={() => navigate(`/products/${product.id}`)}>View</button>
                  {/* <button onClick={() => navigate(`/cart`)}>Add to cart</button> */}
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={observerRef} style={{ height: "20px" }}>
          {isFetching ? "Loading more..." : ""}
        </div>
      </div>
      {!hasNextPage && <p>End of list</p>}
    </div>
  );
};
