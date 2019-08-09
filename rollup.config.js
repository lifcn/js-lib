import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from "rollup-plugin-terser";

export default [
	{
    input: 'src/index.ts',
    output: [
      { file: 'dist/eoneo-pay.js', format: 'cjs' },
      { file: 'dist/eoneo-pay.min.js', format: 'cjs' },
      { file: 'doc/.vuepress/public/eoneo-pay.min.js', format: 'cjs' }
    ],
		plugins: [
      typescript({
        useTsconfigDeclarationDir: true,
        tsconfig: 'tsconfig.json',
      }),
      commonjs(),
			resolve(),
      terser({
        include: [/^.+\.min\.js$/],
      }),
		],
	},
];