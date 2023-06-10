// 必要なライブラリ・コンポーネントをインポート
import "./App.css";
import Main from "./components/Main";
import NotFound from "./components/NotFound";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GuestRoute, PrivateRoute } from "./AuthRoute";
import client from "./apolloClient";
import { ApolloProvider } from "@apollo/client";

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        {/* ルーティングの基本設定を提供するBrowserRouterを使ってルーティングを設定 */}
        <Routes>
          {/* 複数のルートを管理するコンポーネント 
        ログインしていないユーザー向けのルート 
        SignInコンポーネントとSignUpコンポーネントはGuestRoute内でラップされていて、
        すでに認証されているユーザーがこれらのページにアクセスしようとするとホームにリダイレクトされる */}
          <Route
            path="/signin"
            element={<GuestRoute children={<SignIn />} />}
          />
          <Route
            path="/signup"
            element={<GuestRoute children={<SignUp />} />}
          />
          {/* ログイン済みのユーザー向けのルート 
        MainコンポーネントはPrivateRoute内でラップされていて、
        未認証のユーザーがこのページにアクセスしようとするとログインページにリダイレクトされる */}
          <Route path="/" element={<PrivateRoute children={<Main />} />} />
          {/* マッチしないルートにはNotFoundコンポーネントが表示される */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
