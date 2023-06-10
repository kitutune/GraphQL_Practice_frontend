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
import { User } from "../types/user";
import { SIGN_IN, SIGN_UP } from "../mutations/authMutations";
import { SignInResponse } from "../types/signInResponse";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

export default function SignUp() {
  // 各種状態を管理するためのuseStateフックを利用します。
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Apollo ClientのuseMutationフックを使用してサインアップ操作を行います。
  const [signUp] = useMutation<{ createUser: User }>(SIGN_UP);

  // Apollo ClientのuseMutationフックを使用してサインイン操作を行います。
  const [signIn] = useMutation<SignInResponse>(SIGN_IN);

  // react-router-domのuseNavigateフックを使い、ルーティングを行います。
  const navigate = useNavigate();

  // フォームの送信を処理する非同期関数です。
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // フォームが通常のページリロードを引き起こさないようにします。
    event.preventDefault();

    // サインアップの入力データを作成します。
    const signUpInput = { name, email, password };
    try {
      // サインアップ操作を実行し、その結果を取得します。
      const result = await signUp({
        variables: { createUserInput: signUpInput },
      });
      // ユーザー作成が成功した場合
      if (result.data?.createUser) {
        // ユーザー作成後、自動的にサインインするための処理を行います。
        const signInInput = { email, password };
        const result = await signIn({
          variables: { signInInput },
        });
        // サインインの結果をlocalStorageに保存します。
        if (result.data) {
          localStorage.setItem("token", result.data.signIn.accessToken);
        }
        // localStorageからトークンを取得し、それが存在する場合はホームページにリダイレクトします。
        localStorage.getItem("token") && navigate("/");
      }
    } catch (err: any) {
      // ユーザー作成に失敗した場合の処理を行います。
      alert("ユーザーの作成に失敗しました");
      return;
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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
