import React, { useContext, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import { useInfiniteUserProfile } from "../hooks/useInfiniteUserProfile";
import { useInView } from "react-intersection-observer";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@radix-ui/react-dropdown-menu";

import { CalendarDays, User, AlertCircle, LogIn, Loader2 } from "lucide-react";

const ProfilePage = () => {
  const { auth } = useContext(AuthContext);
  const { username } = useParams();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteUserProfile(username);

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!auth.token) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-muted">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">Akses dibatasi</CardTitle>
            <CardDescription>
              Anda harus login untuk melihat halaman profil pengguna
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/login">
                <LogIn className="w-4 h-4 mr-2" /> Login Sekarang
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container max-w-5xl py-8 mx-auto space-y-8">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="w-40 h-6" />
              <Skeleton className="w-32 h-4" />
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="w-full h-48 rounded-xl" />
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-1/2 h-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-2xl py-10 mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Terjadi Kesalahan</AlertTitle>
          <AlertDescription>
            {error.message === "No token or username"
              ? "Profile tidak ditemukan."
              : "Gagal memuat profile. Silakan coba lagi nanti."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const profile = data?.pages[0];
  if (!profile) {
    return (
      <div className="container py-10 text-center">
        <p className="text-muted-foreground">Profile tidak ditemukan.</p>
      </div>
    );
  }

  const allPosts = data.pages.flatMap((page) => page.posts);

  return (
    <div className="container max-w-6xl px-4 py-8 mx-auto space-y-8">
      <Card className="overflow-hidden border-none shadow-md bg-card">
        <div className="h-32 bg-gradient-to-r from-primary/10 to-primary/5"></div>
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col items-start gap-4 -mt-12 sm:flex-row sm:items-end">
            {/* Avatar */}
            <Avatar className="w-24 h-24 border-4 shadow-sm border-background">
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                {profile.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 mt-2 space-y-1 sm:mt-0">
              <h2 className="text-3xl font-bold tracking-tight">
                {profile.username}
              </h2>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays className="w-4 h-4 mr-1" />
                <span>
                  Bergabung sejak{" "}
                  {new Date(profile.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* 2. Posts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold tracking-tight">
            Postingan ({allPosts.length})
          </h3>
        </div>

        {allPosts.length > 0 ? (
          <>
            {/* Grid Layout untuk PostCard */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allPosts.map((post) => (
                <PostCard key={post.id} post={post} showAuthor={false} />
              ))}
            </div>

            {/* Infinite Scroll Loader */}
            <div ref={ref} className="flex justify-center py-8">
              {isFetchingNextPage ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Memuat postingan lainnya...</span>
                </div>
              ) : hasNextPage ? (
                <span className="text-sm text-muted-foreground">
                  Scroll untuk melihat lebih banyak
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Semua postingan telah ditampilkan
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg border-muted">
            <div className="p-4 mb-4 rounded-full bg-muted/50">
              <User className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Belum ada postingan</h3>
            <p className="text-muted-foreground">
              Pengguna ini belum membuat postingan apapun.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
