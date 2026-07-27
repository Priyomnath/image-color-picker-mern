// import { Navigate } from "react-router-dom";

// function ProtectedRoute({ children }) {

//   const user = localStorage.getItem("user");

//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   return children;
// }

// export default ProtectedRoute;



import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;