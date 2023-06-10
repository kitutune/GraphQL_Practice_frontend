// jwt-decode ライブラリをインポートします。これは JWT（JSON Web Tokens）をデコードするためのライブラリです。
import jwtDecode from "jwt-decode";

// React の useEffect と useState フックをインポートします。これらはコンポーネント内でサイドエフェクトや状態管理を行うためのフックです。
import { useEffect, useState } from "react";

// Payload 型をインポートします。これは JWT のペイロード部分の型定義を含みます。
import { Payload } from "../types/payload";

// useAuth というカスタムフックを定義します。
export const useAuth = () => {
  // authInfoという状態を定義します。初期値は{checked: false, isAuthenticated: false}です。
  // checkedは認証チェックが完了したかどうか、isAuthenticatedはユーザーが認証されているかどうかを示します。
  const [authInfo, setAuthInfo] = useState<{
    checked: boolean;
    isAuthenticated: boolean;
  }>({ checked: false, isAuthenticated: false });

  // useEffectフックを使用します。これはサイドエフェクト（非同期処理など）を実行するためのフックです。
  useEffect(() => {
    // localStorageから'token'というキーでJWTを取得します。
    const token = localStorage.getItem("token");

    try {
      // トークンが存在する場合、以下の処理を行います。
      if (token) {
        // トークンをデコードします。このとき、ペイロードの型としてPayload型を指定します。
        const decodedToken = jwtDecode<Payload>(token);

        // トークンの有効期限が切れている場合（現在の時間がトークンのexp（有効期限）よりも後である場合）、
        if (decodedToken.exp * 1000 < Date.now()) {
          /* JWTの `exp`（有効期限）フィールドは通常、UNIXタイムスタンプ（1970年1月1日からの経過秒数）としてエンコードされています。
          しかし、JavaScriptの `Date.now()` メソッドはミリ秒単位のUNIXタイムスタンプを返します。
          したがって、二つを比較するには `exp` を1000倍にしてミリ秒に換算する必要があります。
          したがって、 `decodedToken.exp * 1000 < Date.now()` の式は、
          現在の日時（ミリ秒単位）がトークンの有効期限（ミリ秒単位に換算）を過ぎているかどうかをチェックしています。 */
          // ローカルストレージからトークンを削除し、認証情報を更新します。
          localStorage.removeItem("token");
          setAuthInfo({ checked: true, isAuthenticated: false });
        } else {
          // トークンがまだ有効な場合、認証情報を更新します。
          setAuthInfo({ checked: true, isAuthenticated: true });
        }
      } else {
        // トークンが存在しない場合、認証情報を更新します。
        setAuthInfo({ checked: true, isAuthenticated: false });
      }
    } catch (error) {
      // 何らかのエラーが発生した場合（例えば、トークンの形式が不正な場合など）、認証情報を更新します。
      setAuthInfo({ checked: true, isAuthenticated: false });
    }
  }, []); // useEffectの依存配列が空のため、このエフェクトはコンポーネントのマウント時に一度だけ実行されます。

  // authInfoを返します。これにより、このフックを使用するコンポーネントは現在の認証情報を取得できます。
  return authInfo;
};
