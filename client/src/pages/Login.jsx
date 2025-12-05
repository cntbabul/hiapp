import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const { isLoggingIn } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // dispatch(login(formData));
  }
  return (<>
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left side form  */}
      <div className="flex flex-col justify-center items-center px-6 py-12">
        {/* logo & heading  */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-100 p-3 rounded-lg">
            <MessageSquare className="text-blue-500 w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold mt-4">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-2">
            Sign in to your account
          </p>

        </div>
        {/* Login from  */}

      </div>
    </div>
  </>);
};

export default Login;
