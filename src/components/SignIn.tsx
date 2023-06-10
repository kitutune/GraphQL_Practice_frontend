import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { SignInResponse } from "../types/signInResponse";
import { SIGN_IN } from "../mutations/authMutations";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

export default function SignIn() {
  // 各種状態を管理するためのuseStateフックを利用します。
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failSignIn, setFailSignIn] = useState(false);

  // Apollo ClientのuseMutationフックを使用してサインイン操作を行います。
  const [signIn] = useMutation<SignInResponse>(SIGN_IN);

  // react-router-domのuseNavigateフックを使い、ルーティングを行います。
  const navigate = useNavigate();

  // フォームの送信を処理する非同期関数です。
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // フォームが通常のページリロードを引き起こさないようにします。
    event.preventDefault();

    // サインインの入力データを作成します。
    const signInInput = { email, password };
    try {
      // サインイン操作を実行し、その結果を取得します。
      const result = await signIn({
        variables: { signInInput },
      });
      // レスポンスデータが存在する場合、localStorageにアクセストークンを保存します。
      if (result.data) {
        localStorage.setItem("token", result.data.signIn.accessToken);
      }
      // localStorageからトークンを取得し、それが存在する場合はホームページにリダイレクトします。
      localStorage.getItem("token") && navigate("/");
    } catch (err: any) {
      // エラーハンドリングを行います。
      // エラーメッセージが"Unauthorized"の場合は、ログイン失敗を表す状態をセットします。
      if (err.message === "Unauthorized") {
        setFailSignIn(true);
        return;
      }
      // それ以外のエラーの場合は、エラーメッセージをコンソールに出力し、
      // ユーザーに対してアラートダイアログを表示します。
      console.log(err.message);
      alert("予期せぬエラーが発生しました");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {failSignIn && (
              <Typography color="red">
                メールアドレスまたはパスワードを確認してください。
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

/* 
handleSubmit関数では、まずフォームの送信イベントを引数に取り、
デフォルトのページリロードを防ぐためにevent.preventDefault()を呼び出します。
次にサインインの入力データを作成し、signIn関数を呼び出してサーバーにデータを送信します。

この関数は非同期ですので、結果を待つためにawaitを使用します。
サーバーからのレスポンスが正常であれば、
そのデータ（具体的にはアクセストークン）をlocalStorageに保存します。
そして、そのトークンが存在することを確認してから、ユーザーをホームページにリダイレクトします。

もし何か問題が発生すれば、例外がスローされ、catchブロックが実行されます。
ここではエラーのメッセージを確認し、
それが"Unauthorized"である場合はログインに失敗したことを示すためにfailSignIn状態をセットします。
それ以外のエラーの場合は、エラーメッセージをコンソールに出力し、アラートダイアログでユーザーに通知します。






*/
