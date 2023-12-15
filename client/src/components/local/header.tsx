import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const onNavigationClicked = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );

  return (
    <div className="mb-6 mt-2 flex justify-between">
      <div>
        <Button
          variant={location.pathname === "/" ? "secondary" : "link"}
          onClick={() => onNavigationClicked("/")}
        >
          Dashboard
        </Button>
        <Button
          variant={location.pathname === "/members" ? "secondary" : "link"}
          onClick={() => onNavigationClicked("/members")}
        >
          Members
        </Button>
        <Button
          variant={location.pathname === "/authors" ? "secondary" : "link"}
          onClick={() => onNavigationClicked("/authors")}
        >
          Authors
        </Button>
        <Button
          variant={location.pathname === "/genres" ? "secondary" : "link"}
          onClick={() => onNavigationClicked("/genres")}
        >
          Genres
        </Button>
        <Button
          variant={location.pathname === "/books" ? "secondary" : "link"}
          onClick={() => onNavigationClicked("/books")}
        >
          Books
        </Button>
      </div>

      <Button
        variant="destructive"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
          window.location.reload();
        }}
      >
        Log Out
      </Button>
    </div>
  );
}
