import { gql } from "@apollo/client"; // Apollo Clientのgqlテンプレートリテラルをインポートします。

// CREATE_TASKはcreateTaskという名前のミューテーションを定義しています。
// 最初のcreateTask($createTaskInput: CreateTaskInput!) はミューテーション自体を定義しています。
// $createTaskInputは変数を示し、これがCreateTaskInput!型であることを示しています。
// "!"はこの変数が必須であることを示しています。
export const CREATE_TASK = gql`
mutation createTask($createTaskInput: CreateTaskInput!) {
  // 2つ目のcreateTask(createTaskInput: $createTaskInput)はサーバーに送信する具体的なミューテーションのリクエストを定義しています。
  // ここで、上で定義した$createTaskInput変数を実際に使用しています。
  // そして、このミューテーションが成功したときにサーバーから受け取るデータを定義しています。
  // ここでは、新しく作成されたタスクのid、name、dueDate、status、descriptionを受け取ります。
  createTask(createTaskInput: $createTaskInput) {
    id
    name
    dueDate
    status
    description
  }
}
`;
// 同様に、UPDATE_TASKとDELETE_TASKも定義します。

// updateTaskミューテーションを定義します。このミューテーションは、サーバー上の既存のタスクを更新するために使用されます。
// ミューテーションは一つの入力（updateTaskInput）を取り、その入力はUpdateTaskInput型である必要があります。
// ミューテーションが成功すると、更新されたタスクのid、name、dueDate、status、descriptionが返されます。
export const UPDATE_TASK = gql`
  mutation updateTask($updateTaskInput: UpdateTaskInput!) {
    updateTask(updateTaskInput: $updateTaskInput) {
      id
      name
      dueDate
      status
      description
    }
  }
`;

// deleteTaskミューテーションを定義します。このミューテーションは、サーバー上のタスクを削除するために使用されます。
// ミューテーションは一つの入力（id）を取り、そのidはInt型である必要があります。
// ミューテーションが成功すると、削除されたタスクのidが返されます。
export const DELETE_TASK = gql`
  mutation deleteTask($id: Int!) {
    deleteTask(id: $id) {
      id
    }
  }
`;
