import { getData } from './dataStore';

export function validUserId(id: number) {
  const data = getData();
  const found = data.users.find(item => item.uId === id);
  if (found) {
    return {
      user: found,
      validUserId: true,
    };
  }
  return {
    user: found,
    validUserId: false
  };
}
