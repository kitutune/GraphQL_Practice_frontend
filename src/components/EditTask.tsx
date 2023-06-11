import { useState } from "react"; // useStateフックをインポート
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material"; // Material-UIの各種コンポーネントをインポート
import EditIcon from "@mui/icons-material/Edit"; // 編集アイコンをインポート
import { Task } from "../types/task"; // Task型をインポート
import { TaskStatus } from "../types/taskStatus"; // TaskStatus型をインポート
import { useMutation } from "@apollo/client"; // useMutationフックをインポート
import { UPDATE_TASK } from "../mutations/taskMutations"; // UPDATE_TASKミューテーションをインポート
import { GET_TASKS } from "../queries/taskQueries"; // GET_TASKSクエリをインポート
import { useNavigate } from "react-router-dom"; // useNavigateフックをインポート

export default function EditTask({
  task,
  userId,
}: {
  task: Task;
  userId: number;
}) {
  // 各種の状態をuseStateフックを使用して初期化
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(task.name);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [status, setStatus] = useState(task.status);
  const [description, setDescription] = useState(task.description);
  const [isInvalidName, setIsInvalidName] = useState(false);
  const [isInvalidDueDate, setIsInvalidDueDate] = useState(false);

  const navigate = useNavigate(); // ナビゲーション関数を取得
  const [updateTask] = useMutation<{ updateTask: Task }>(UPDATE_TASK); // UPDATE_TASKミューテーションを初期化

  // 状態を初期値にリセットする関数
  const resetState = () => {
    setName(task.name);
    setDueDate(task.dueDate);
    setStatus(task.status);
    setDescription(task.description);
    setIsInvalidName(false);
    setIsInvalidDueDate(false);
  };

  // タスクの編集をハンドルする関数
  const handleEditTask = async () => {
    let canEdit = true;

    // タスク名のバリデーション
    if (name.length === 0) {
      canEdit = false;
      setIsInvalidName(true);
    } else {
      setIsInvalidName(false);
    }

    // 期日のバリデーション
    if (!Date.parse(dueDate)) {
      canEdit = false;
      setIsInvalidDueDate(true);
    } else {
      setIsInvalidDueDate(false);
    }

    // バリデーションが成功した場合にタスクを更新
    if (canEdit) {
      const updateTaskInput = {
        id: task.id,
        name,
        dueDate,
        status,
        description,
      };
      try {
        await updateTask({
          variables: { updateTaskInput },
          refetchQueries: [{ query: GET_TASKS, variables: { userId } }], // タスク更新後にタスクリストを再取得
        });
        resetState(); // 状態をリセット
        setOpen(false); // ダイアログを閉じる
      } catch (err: any) {
        // エラーハンドリング
        if (err.message === "Unauthorized") {
          localStorage.removeItem("token");
          alert("トークンの有効期限が切れました。サインイン画面に遷移します。");
          navigate("/signin");
          return;
        }

        alert("タスクの編集に失敗しました");
      }
    }
  };

  // ダイアログを開く関数
  const handleClickOpen = () => {
    resetState(); // 状態をリセット
    setOpen(true); // ダイアログを開く
  };

  // ダイアログを閉じる関数
  const handleClose = () => {
    resetState(); // 状態をリセット
    setOpen(false); // ダイアログを閉じる
  };

  return (
    <div>
      <Tooltip title="編集">
        <IconButton onClick={handleClickOpen}>
          <EditIcon color="action" />
        </IconButton>
      </Tooltip>
      <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
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
          <FormControl fullWidth={true} margin="normal">
            <InputLabel id="task-status-label">Status</InputLabel>
            <Select
              labelId="task-status-label"
              id="task-status"
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              <MenuItem value={"NOT_STARTED"}>Not Started</MenuItem>
              <MenuItem value={"IN_PROGRESS"}>In Progress</MenuItem>
              <MenuItem value={"COMPLETED"}>Completed</MenuItem>
            </Select>
          </FormControl>
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEditTask}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
