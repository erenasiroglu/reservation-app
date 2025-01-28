export const fetchOccupiedSeats = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const users = await response.json();
      return users.slice(0, 10);
    } catch (error) {
      console.error('Error fetching occupied seats:', error);
      return [];
    }
  };