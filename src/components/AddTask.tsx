// 必要なパッケージとコンポーネントをインポートします
import { useState } from "react"; // Reactのstateフックを使います
import Button from "@mui/material/Button"; // ボタンコンポーネントをインポートします
import TextField from "@mui/material/TextField"; // テキストフィールドコンポーネントをインポートします
import Dialog from "@mui/material/Dialog"; // ダイアログコンポーネントをインポートします
import DialogActions from "@mui/material/DialogActions"; // ダイアログのアクションエリアコンポーネントをインポートします
import DialogContent from "@mui/material/DialogContent"; // ダイアログのコンテンツエリアコンポーネントをインポートします
import DialogTitle from "@mui/material/DialogTitle"; // ダイアログのタイトルエリアコンポーネントをインポートします
import { useMutation } from "@apollo/client"; // Apollo Clientのmutationフックを使います
import { Task } from "../types/task"; // タスクの型定義をインポートします
import { CREATE_TASK } from "../mutations/taskMutations"; // タスク作成用のGraphQLミューテーションをインポートします
import { GET_TASKS } from "../queries/taskQueries"; // タスク取得用のGraphQLクエリをインポートします
import { useNavigate } from "react-router-dom"; // react-router-domのnavigateフックを使います

// AddTaskコンポーネントを定義します
export default function AddTask({ userId }: { userId: number }) {
  // 必要なstateを定義します
  const [open, setOpen] = useState(false); // ダイアログが開いているかどうかのstate
  const [name, setName] = useState(""); // タスク名のstate
  const [dueDate, setDueDate] = useState(""); // 期限日のstate
  const [description, setDescription] = useState(""); // 説明のstate
  const [isInvalidName, setIsInvalidName] = useState(false); // タスク名が無効かどうかのstate
  const [isInvalidDueDate, setIsInvalidDueDate] = useState(false); // 期限日が無効かどうかのstate
  const [createTask] = useMutation<{ createTask: Task }>(CREATE_TASK); // タスク作成用のmutationフック
  const navigate = useNavigate(); // ナビゲーション用のフック

  // stateをリセットする関数を定義します
  const resetState = () => {
    setName("");
    setDueDate("");
    setDescription("");
    setIsInvalidName(false);
    setIsInvalidDueDate(false);
  };

  // タスクを追加する関数を定義します
  const handleAddTask = async () => {
    let canAdd = true;

    // タスク名が入力されているかチェックします
    if (name.length === 0) {
      canAdd = false;
      setIsInvalidName(true);
    } else {
      setIsInvalidName(false);
    }

    // 期限日が正しい形式で入力されているかチェックします
    if (!Date.parse(dueDate)) {
      canAdd = false;
      setIsInvalidDueDate(true);
    } else {
      setIsInvalidDueDate(false);
    }

    // タスク名と期限日が有効であればタスクを追加します
    if (canAdd) {
      const createTaskInput = { name, dueDate, description, userId };
      try {
        // タスクを追加し、成功したらstateをリセットしてダイアログを閉じます
        await createTask({
          variables: { createTaskInput },
          refetchQueries: [{ query: GET_TASKS, variables: { userId } }],
        });
        resetState();
        setOpen(false);
      } catch (err: any) {
        // トークンが切れている場合はサインイン画面に遷移します
        if (err.message === "Unauthorized") {
          localStorage.removeItem("token");
          alert("トークンの有効期限が切れました。サインイン画面に遷移します。");
          navigate("/signin");
          return;
        }

        // タスクの追加に失敗した場合はエラーメッセージを表示します
        alert("タスクの登録に失敗しました");
      }
    }
  };

  // ダイアログを開く関数を定義します
  const handleClickOpen = () => {
    setOpen(true);
  };

  // ダイアログを閉じる関数を定義します
  const handleClose = () => {
    resetState();
    setOpen(false);
  };

  // JSXを返します
  return (
    <div>
      {/* タスク追加ボタンと、そのクリックで開くダイアログを定義します */}
      <Button
        variant="contained"
        sx={{ width: "270px" }}
        onClick={handleClickOpen}
      >
        Add Task
      </Button>
      <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose}>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          {/* タスク名、期限日、説明を入力するフィールドを定義します */}
          <TextField
            autoFocus
            margin="normal"
            id="name"
            label="Task Name"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={isInvalidName}
            helperText={isInvalidName && "タスク名を入力してください"}
          />
          <TextField
            autoFocus
            margin="normal"
            id="due-date"
            label="Due Date"
            placeholder="yyyy-mm-dd"
            fullWidth
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            error={isInvalidDueDate}
            helperText={isInvalidDueDate && "日付形式で入力してください"}
          />
          <TextField
            autoFocus
            margin="normal"
            id="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          {/* キャンセルボタンと、タスクを追加するボタンを定義します */}
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddTask}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
