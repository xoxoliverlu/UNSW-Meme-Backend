function echo(value) {
  if (value === 'echo') {
    return { error: 'error' };
  }
  return value;
}

export { echo };
