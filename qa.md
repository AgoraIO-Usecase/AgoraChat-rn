_[Chinese](./README.zh.md)| [English](./README.md)_

---

1. The program is not running properly. Hint: `Invariant Violation: Module AppRegistry is not a registered callable module (calling runApplication). A frequent cause of the error is that the application entry file path is incorrect.`.

   The 'main.jsbundle' file may not be generated properly. You need to check that the files for programs such as' env.ts' 'version.ts' already exist. If no, run the script to generate the file.

   ```bash
   yarn run generate
   ```
