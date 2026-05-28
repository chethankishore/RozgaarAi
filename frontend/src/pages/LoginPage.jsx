import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { parseError } from "../utils/parseError";
import toast from "react-hot-toast";

const schema = yup.object({
  email:    yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Min 6 characters").required("Password is required"),
});

export default function LoginPage() {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data) {
    try {
      console.log(data);
      await login(data);
      toast.success("Welcome back!", { position: "top-center" });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(parseError(err), { position: "top-center" });
    }
  }

  return (
    <div style={{ minHeight: "calc(100vh - var(--navbar-height))", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-8)" }}>
      <div className="card" style={{ width: "100%", maxWidth: 420 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", marginBottom: "var(--space-2)" }}>
          Welcome back
        </h2>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-6)" }}>
          Log in to your ResumeAI account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <label style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--color-text-secondary)" }}>
              Email
            </label>
            <input className="input" type="email" placeholder="you@email.com" {...register("email")} />
            {errors.email && (
              <span style={{ fontSize: "var(--text-xs)", color: "var(--color-danger)" }}>{errors.email.message}</span>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <label style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--color-text-secondary)" }}>
              Password
            </label>
            <input className="input" type="password" placeholder="••••••••" {...register("password")} />
            {errors.password && (
              <span style={{ fontSize: "var(--text-xs)", color: "var(--color-danger)" }}>{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ width: "100%", marginTop: "var(--space-2)" }}
          >
            {isSubmitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "var(--space-5)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--color-primary)", fontWeight: "var(--weight-medium)" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}