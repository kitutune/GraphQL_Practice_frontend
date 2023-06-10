import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

// 親コンポーネントからchildrenというプロパティを受け取る型を定義
type Props = {
  children: ReactNode;
};

/* このコードは、認証済みユーザー専用のページ（PrivateRoute）と
ゲストユーザー専用のページ（GuestRoute）を表示するためのReactコンポーネントを定義しています。
それぞれのコンポーネントは認証情報をチェックし、
表示すべき内容（子コンポーネント）またはリダイレクト先を決定します。 */

// PrivateRouteコンポーネント定義。ログイン状態でないとchildrenを表示しない。
export const PrivateRoute = ({ children }: Props) => {
  // useAuthカスタムフックを用いて認証情報を取得
  const authInfo = useAuth();

  // 認証情報がまだ確認されていない場合、Loading...を表示
  if (!authInfo.checked) {
    return <div>Loading...</div>;
  }

  // ユーザが認証されている場合、子コンポーネント（children）を表示
  if (authInfo.isAuthenticated) {
    return <>{children}</>;
  }

  // ユーザが認証されていない場合、サインインページにリダイレクト
  return <Navigate to="/signin" />;
};

// GuestRouteコンポーネント定義。ログイン状態であればchildrenを表示せず、ルートにリダイレクトする。
export const GuestRoute = ({ children }: Props) => {
  // useAuthカスタムフックを用いて認証情報を取得
  const authInfo = useAuth();

  // 認証情報がまだ確認されていない場合、Loading...を表示
  if (!authInfo.checked) {
    return <div>Loading...</div>;
  }

  // ユーザが認証されている場合、ルートページ（ホームページ）にリダイレクト
  if (authInfo.isAuthenticated) {
    return <Navigate to="/" />;
  }

  // ユーザが認証されていない場合、子コンポーネント（children）を表示
  return <>{children}</>;
};
