// ApolloClient、createHttpLink、InMemoryCacheのインポート
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

// setContextをインポート（Apollo Linkからのもので、コンテクストを設定するためのもの）
import { setContext } from "@apollo/client/link/context";

// GraphQL サーバーへのリンクを作成
const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql", // GraphQLサーバーのURL
});

// authLinkを作成（認証情報を含むヘッダーをリクエストに追加する）
// setContextはリクエストごとに呼び出され、戻り値としてコンテクストを返す関数を取ります
const authLink = setContext((_, prevContext) => {
  const token = localStorage.getItem("token"); // ローカルストレージから認証トークンを取得

  return {
    headers: {
      ...prevContext.headers, // 既存のヘッダーをそのまま保持
      authorization: token ? `Bearer ${token}` : "", // Bearerトークンを認証ヘッダーに設定
    },
  };
});

// Apolloクライアントを作成
const client = new ApolloClient({
  link: authLink.concat(httpLink), // authLinkとhttpLinkを結合
  cache: new InMemoryCache(), // キャッシュをInMemoryCache（デフォルト）で設定
});

export default client; // クライアントをエクスポート

/* 
このコードでは、Apolloクライアントが作成され、それはあなたのGraphQLサーバーへのリンクと、
認証情報を含むヘッダーを持つApollo Linkを使用します。
認証情報はBearer ${token}形式で格納され、これは一般的な形式です。

Bearer ${token}は、HTTPヘッダーのAuthorizationフィールドで使われる一般的なスキームです。
ここでBearerは、その後に続くトークンが"bearer token"であることを示しています。
bearer tokenは、リソースへのアクセスを提供するセキュリティトークンの一種で、
その所有者（"bearer"）がリソースへのアクセスを許可されるという意味を持っています。

*/
