// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier'; // 변경됨
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'eslint.config.mjs',
      'src/config/database.config.js', // 기존 예외 파일
      'dist/**',  // dist 폴더 전체 무시
      'public/**', // public 폴더 전체 무시
      'node_modules/**', // node_modules 무시
      'test/**',  // 테스트 폴더도 제외 (필요하면)
      'src/**/*.d.ts' // 모든 .d.ts 파일 ESLint 검사에서 제외
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    plugins: {
      prettier: eslintPluginPrettier
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: "latest",
      sourceType: 'module',
      parserOptions: {
        project: ["./tsconfig.json"],  // 배열 형태로 설정
        tsconfigRootDir: process.cwd(), // 프로젝트 루트 기준으로 설정
      },
    },
  },
  {
    rules: {
      'prettier/prettier': 'off', // Prettier 오류 무시
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/await-thenable': 'off'
    },
  },
);