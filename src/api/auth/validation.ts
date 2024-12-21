export function validateEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
    return emailRegex.test(email);
  }
  
  export function validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/;
    return passwordRegex.test(password);
  }
  