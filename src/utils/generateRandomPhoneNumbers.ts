export const generateRandomPhoneNumbers = (min: number, max: number): string[] => {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const numbers: string[] = [];
  
    for (let i = 0; i < count; i++) {
      const randomPhoneNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      numbers.push(randomPhoneNumber);
    }
  
    return numbers;
};
