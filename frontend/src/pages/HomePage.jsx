import React, { useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useInfinitePosts } from "../hooks/usePosts";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useDebouncedSearch("search", 1200);
  const { auth } = useContext(AuthContext);

  const { posts, loading, error, hasMore, lastPostElementRef } =
    useInfinitePosts(searchParams);

  const displayedPosts = auth.token ? posts : posts.slice(0, 5);

  return (
    <div className="max-w-2xl mx-auto">
      {auth.token && (
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari postingan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md pl-10"
            />
          </div>
        </div>
      )}{" "}
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Postingan Terbaru</h2>
        <p className="mt-2 text-muted-foreground">
          {!auth.token && "Login untuk melihat semua postingan"}
        </p>
      </div>
      <Separator className="mb-6" />
      <div className="space-y-6">
        {displayedPosts.map((post, index) => {
          if (auth.token && displayedPosts.length === index + 1) {
            return (
              <div ref={lastPostElementRef} key={post.id}>
                <PostCard post={post} />
              </div>
            );
          }
          return (
            <div key={post.id}>
              <PostCard post={post} />
            </div>
          );
        })}
      </div>
      {/* Empty State */}
      {posts.length === 0 && !loading && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Belum ada post yang cocok.</p>
        </div>
      )}
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}
      {/* End of List */}
      {!hasMore && !loading && posts.length > 0 && (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Anda telah mencapai akhir daftar.
          </p>
        </div>
      )}
      {/* Error State */}
      {error && (
        <div className="p-4 mt-6 border rounded-lg border-destructive/50">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
      {/* Login Prompt for Non-authenticated Users */}
      {!auth.token && posts.length >= 5 && (
        <div className="p-8 mt-8 text-center border rounded-lg bg-muted/50">
          <p className="mb-4 text-lg font-medium">
            Ingin melihat lebih banyak postingan?
          </p>
          <Link to="/login">
            <Button size="lg">Login Sekarang</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;
