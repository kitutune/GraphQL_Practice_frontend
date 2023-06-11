// MUIのIconButtonとTooltipをインポートします
import { IconButton, Tooltip } from "@mui/material";
// MUIのDeleteIconをインポートします
import DeleteIcon from "@mui/icons-material/Delete";
// Apollo ClientのuseMutationフックをインポートします
import { useMutation } from "@apollo/client";
// 自作のDELETE_TASKミューテーションをインポートします
import { DELETE_TASK } from "../mutations/taskMutations";
// 自作のGET_TASKSクエリをインポートします
import { GET_TASKS } from "../queries/taskQueries";
// react-router-domのuseNavigateフックをインポートします
import { useNavigate } from "react-router-dom";

// DeleteTaskコンポーネントを定義します
const DeleteTask = ({ id, userId }: { id: number; userId: number }) => {
  // DELETE_TASKミューテーションを使用するためのフックを定義します
  const [deleteTask] = useMutation<{ deleteTask: number }>(DELETE_TASK);
  // ナビゲーションのためのフックを定義します
  const navigate = useNavigate();

  // タスクを削除する関数を定義します
  const handleDeleteTask = async () => {
    try {
      // タスクを削除し、成功したらメッセージを表示します
      await deleteTask({
        variables: { id },
        refetchQueries: [{ query: GET_TASKS, variables: { userId } }],
      });
      alert("タスクが削除されました");
    } catch (err: any) {
      // トークンが切れている場合はサインイン画面に遷移します
      if (err.message === "Unauthorized") {
        localStorage.removeItem("token");
        alert("トークンの有効期限が切れました。サインイン画面に遷移します");
        navigate("/signin");
        return;
      }
      // タスクの削除に失敗した場合はエラーメッセージを表示します
      alert("タスクの削除に失敗しました");
    }
  };

  // JSXを返します
  return (
    <div>
      {/* 削除ボタンを定義します */}
      <Tooltip title="削除">
        <IconButton onClick={handleDeleteTask}>
          <DeleteIcon color="action" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

// DeleteTaskコンポーネントをエクスポートします
export default DeleteTask;
