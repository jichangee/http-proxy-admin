const BASE_URL = {
  development: 'http://localhost:30000',
  production: ''
}

export const config = (env) => {
  return {
    BASE_URL: BASE_URL[env]
  }
}

export default config(process.env.NODE_ENV)