import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import PaginationComponent from "./components/Pagination";

function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const skip = (currentPage - 1) * limit;

  const queryClient = useQueryClient();

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryFn: () =>
      axios.get(
        `https://json-api.uz/api/project/todos-api/todos/?skip=${skip}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
    queryKey: ["todos", currentPage],
  });

  const addPostMutation = useMutation({
    mutationFn: (newPost) =>
      axios.post("https://json-api.uz/api/project/todos-api/todos", newPost, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleAddPost = (e) => {
    e.preventDefault();
    const title = e.target.title.value;

    if (!title) {
      alert("Iltimos maydonni to'ldiring!");
      return;
    }

    addPostMutation.mutate({ title, body });
    e.target.reset();
  };

  if (isLoading) {
    return <p>Loading process.....</p>;
  }

  return (
    <div>
      {isError && <h1>Error to fetch data</h1>}

      <form
        onSubmit={handleAddPost}
        className="flex flex-col gap-4 p-4 border rounded-md max-w-md mx-auto my-6"
      >
        <h2 className="text-xl font-bold">Yangi Post Qo'shish</h2>
        <input
          type="text"
          name="title"
          placeholder="Sarlavha"
          className="p-2 border rounded-md"
        />

        <button
          type="submit"
          disabled={addPostMutation.isLoading}
          className="p-2 bg-blue-500 text-white rounded-md"
        >
          {addPostMutation.isLoading ? "Qo'shilmoqda..." : "Qo'shish"}
        </button>
      </form>

      <div className="flex flex-col items-center gap-4 justify-around my-10 shadow-xl container mx-auto p-5">
        {isSuccess &&
          data?.data?.data?.map(({ title, id }) => {
            return (
              <div
                key={id}
                className={`flex items-center text-black justify-between rounded-md shadow-lg w-full px-2 py-4 `}
              >
                <h2>{title}</h2>
              </div>
            );
          })}
      </div>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={Math.ceil(data?.data?.total / limit)}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Home;
