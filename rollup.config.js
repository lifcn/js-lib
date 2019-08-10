import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/eoneo-pay.common.js', format: 'cjs' },
      { file: 'dist/eoneo-pay.common.min.js', format: 'cjs' },
      {
        file: 'dist/eoneo-pay.iife.js',
        name: 'EoneoPay',
        format: 'iife'
      }
    ],
    plugins: [
      typescript({
        useTsconfigDeclarationDir: true,
        tsconfig: 'tsconfig.json'
      }),
      commonjs(),
      resolve(),
      terser({
        include: [/^.+\.(min|iife)\.js$/]
      })
    ]
  }
]
