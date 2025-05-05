import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useForm from "../hooks/useForm";
import { UserSigninInformation, validateSignin } from "../utils/validate";
import { useEffect } from "react";

export default function LoginPage() {
  const { login, accessToken } = useAuth();
  const navigate = useNavigate();

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: { email: "", password: "" },
      validate: validateSignin,
    });

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [navigate, accessToken]);

  const handleSubmit = async () => {
    const success = await login(values);

    if (success) {
      alert("로그인 성공");
      navigate("/my");
    } else {
      alert("로그인 실패");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) || // 오류가 있으면 true
    Object.values(values).some((value) => value === ""); // 입력값이 비어있으면 true

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col gap-3">
        <input
          type="email"
          name="email"
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                ${
                  errors?.email && touched?.email
                    ? "border-red-500 bg-red-200"
                    : ""
                }`}
          placeholder="이메일"
          {...getInputProps("email")}
        />
        {errors?.email && touched?.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )}
        <input
          type="password"
          name="password"
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${
              errors?.password && touched?.password
                ? "border-red-500 bg-red-200"
                : ""
            }`}
          placeholder="비밀번호"
          {...getInputProps("password")}
        />
        {errors?.password && touched?.password && (
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed "
        >
          로그인
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-center gap-4">
            <img src="/google-logo.svg" alt="google-logo" />
            <span>구글 로그인</span>
          </div>
        </button>
      </div>
    </div>
  );
}
