import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { userData } from "@/app/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthButton() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const BACKEND_API = "https://chat-bot-backend-auth.vercel.app";
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    data = isRegister
      ? { email: data.email, name: data.name, password: data.password }
      : { email: data.email, password: data.password };
    const url = isRegister
      ? `${BACKEND_API}/v1/auth/register`
      : `${BACKEND_API}/v1/auth/login`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Success:", result);
        userData.email = result.user.email;
        userData.name = result.user.name;
        userData.messages = result.user.messages;
        userData.id = result.user.id;
        userData.token = result.tokens.access.token;
        userData.avatar = result.user.avatar;
        router.push(`/${result.user.id}`);
        setDialogOpen(false); // Close the dialog on success
        // Handle success, e.g., show a success message or redirect
      } else {
        console.error("Error:", result);
        setDialogOpen(false);
        setAlertMessage(result.message || "An error occurred");
        setAlertOpen(true); // Show alert dialog on error
      }
    } catch (error) {
      console.error("Error:", error);
      setDialogOpen(false);
      setAlertMessage("A network error occurred");
      setAlertOpen(true); // Show alert dialog on network error
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };
  useEffect(() => {
    if (!dialogOpen) {
      reset();
      setIsRegister(false);
    }
  }, [dialogOpen, reset]);

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary">Masuk</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isRegister ? "Daftar" : "Masuk"}</DialogTitle>
            <DialogDescription>
              {isRegister
                ? "Daftar untuk membuat akun baru."
                : "Masuk untuk melanjutkan pembicaraan terdahulu."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Email"
                {...register("email", { required: "Email dibutuhkan" })}
              />
              {errors.email && (
                <p className="text-red-600">{errors.email.message}</p>
              )}
            </div>
            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  placeholder="nama"
                  {...register("name", {
                    required: "Nama dibutuhkan",
                  })}
                />
                {errors.name && (
                  <p className="text-red-600">{errors.name.message}</p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                {...register("password", { required: "Password dibutuhkan" })}
              />
              {errors.password && (
                <p className="text-red-600">{errors.password.message}</p>
              )}
            </div>
            <DialogFooter className="flex flex-col sm:justify-start space-y-2">
              <Button type="submit" disabled={isLoading}>
                {isRegister ? "Daftar" : "Login"}
              </Button>
              <Button
                type="button"
                variant="link"
                disabled={isLoading}
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister
                  ? "Sudah punya akun? Masuk"
                  : "Belum punya akun? Daftar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setAlertOpen(false)}>OK</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
