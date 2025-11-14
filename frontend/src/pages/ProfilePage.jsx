import React, { useContext, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import { useInfiniteUserProfile } from "../hooks/useInfiniteUserProfile";
import { useInView } from "react-intersection-observer";

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
      <div>
        <h2>Profile Pengguna</h2>
        <p>
          Anda harus <Link to="/login">login</Link> untuk melihat halaman
          profile pengguna
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <p style={{ color: "red" }}>
        {error.message === "No token or username"
          ? "Profile tidak ditemukan"
          : "Gagal memuat profile"}
      </p>
    );
  }

  const profile = data?.pages[0];
  if (!profile) {
    return <p>Profile tidak ditemukan atau sedang dimuat</p>;
  }

  const allPosts = data.pages.flatMap((page) => page.posts);

  return (
    <div>
      <h2>Profil {profile.username}</h2>
      <p>
        <strong>Username: </strong>
        {profile.username}
      </p>
      <p>
        <strong>Bergabung pada:</strong>{" "}
        {new Date(profile.created_at).toLocaleDateString()}
      </p>

      <hr />
      <h3>Postingan oleh {profile.username}</h3>
      {allPosts.length > 0 ? (
        <>
          {allPosts.map((post) => (
            <PostCard key={post.id} post={post} showAuthor={false} />
          ))}
          <div ref={ref} style={{ height: "20px", margin: "20px 0" }}>
            {isFetchingNextPage && <p>Loading more posts...</p>}
          </div>
        </>
      ) : (
        <p>Pengguna ini belum membuat postingan apapun.</p>
      )}
    </div>
  );
};

export default ProfilePage;
