_[Chinese](./README.zh.md)| [English](./README.md)_

---

1. The program is not running properly. Hint: `Invariant Violation: Module AppRegistry is not a registered callable module (calling runApplication). A frequent cause of the error is that the application entry file path is incorrect.`.

   The 'main.jsbundle' file may not be generated properly. You need to check that the files for programs such as' env.ts' 'version.ts' already exist. If no, run the script to generate the file.

   ```bash
   yarn run generate
   ```

2. On the selection of react-native version.

   Repo **[README.md](./README.md)** instructions suggest that developers use '0.68.0' or below, which is the instructions for the warehouse's 'example' project. If the user creates a new project or an existing project, we only require the minimum version. The lowest version needs to be higher than '0.63.4'.
