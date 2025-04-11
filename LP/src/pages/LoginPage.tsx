import { postSignin } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import useForm from "../hooks/useForm";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { UserSigninInformation, validateSignin } from "../utils/validate";

export default function LoginPage() {
  const { setItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: { email: "", password: "" },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    try {
      const res = await postSignin(values);
      setItem(res.data.accessToken);
    } catch (error) {
      alert((error as Error)?.message);
    }
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
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          로그인
        </button>
      </div>
    </div>
  );
}
