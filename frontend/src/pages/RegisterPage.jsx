import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { parseError } from "../utils/parseError";
import toast from "react-hot-toast";

const schema = yup.object({
  name:     yup.string().required("Name is required"),
  email:    yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Min 6 characters").required("Password is required"),
  confirm:  yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Confirm your password"),
});

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data) {
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password });
      toast.success("Account created!", { position: "top-center" });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(parseError(err), { position: "top-center" });
    }
  }

  const fields = [
    { name: "name",     label: "Full name",       type: "text",     placeholder: "Rahul Kumar"  },
    { name: "email",    label: "Email",            type: "email",    placeholder: "you@email.com" },
    { name: "password", label: "Password",         type: "password", placeholder: "••••••••"     },
    { name: "confirm",  label: "Confirm password", type: "password", placeholder: "••••••••"     },
  ];

  return (
    <div style={{ minHeight: "calc(100vh - var(--navbar-height))", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-8)" }}>
      <div className="card" style={{ width: "100%", maxWidth: 420 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", marginBottom: "var(--space-2)" }}>
          Create your account
        </h2>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-6)" }}>
          Start analyzing your resume for free
        </p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {fields.map(f => (
            <div key={f.name} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <label style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--color-text-secondary)" }}>
                {f.label}
              </label>
              <input className="input" type={f.type} placeholder={f.placeholder} {...register(f.name)} />
              {errors[f.name] && (
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-danger)" }}>{errors[f.name].message}</span>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ width: "100%", marginTop: "var(--space-2)" }}
          >
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "var(--space-5)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--color-primary)", fontWeight: "var(--weight-medium)" }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

