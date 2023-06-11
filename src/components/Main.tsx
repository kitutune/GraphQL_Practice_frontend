import { useQuery } from "@apollo/client";
import { Stack, Typography } from "@mui/material";
import jwtDecode from "jwt-decode";
import { GET_TASKS } from "../queries/taskQueries";
import { Payload } from "../types/payload";
import { Task } from "../types/task";
import AddTask from "./AddTask";
import Header from "./Header";
import Loading from "./Loading";
import TaskTable from "./TaskTable";

const Main = () => {
  const token = localStorage.getItem("token"); // ローカルストレージからトークンを取得します。
  const decodedToken = jwtDecode<Payload>(token!); // トークンをデコードしてユーザーIDを取り出します。
  const userId = decodedToken.sub;

  const { loading, data, error } = useQuery<{ getTasks: Task[] }>(GET_TASKS, {
    variables: { userId }, // ユーザーIDを使用してタスクを取得するGraphQLクエリを実行します。
  });

  return (
    <>
      <Header />
      <Stack spacing={4} direction="column" m={8} alignItems="center">
        {loading && <Loading />}
        {/* ローディング中はローディングインジケータを表示します。 */}
        {error && <Typography color="red">エラーが発生しました</Typography>}
        {!loading && !error && (
          <>
            <AddTask userId={userId} />
            {/* タスク追加コンポーネントを表示します。 */}
            <TaskTable tasks={data?.getTasks} userId={userId} />
            {/* タスク一覧コンポーネントを表示します。 */}
          </>
        )}
      </Stack>
    </>
  );
};

export default Main;
