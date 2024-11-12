const express = require("express");
const PORT = 8000;
const fs = require("fs");
const todofile = require("./file.json");
const app = express();

//middleware to use json
app.use(express.json());

//routing

app.get("/api/todos", (req, res) => {
  fs.readFile("./file.json", "utf-8", (err, result) => {
    if (err) {
      console.log("Error");
    } else {
      let jsondata = JSON.parse(result);
      return res.json({ data: jsondata });
    }
  });
});

app.post("/api/inserttodo", (req, res) => {
  const { message } = req.body;
  if (message) {
    const newtodo = { message, id: Date.now(), completed: false };
    console.log(newtodo);

    // Read the existing todos from the file
    fs.readFile("./file.json", "utf8", (err, data) => {
      if (err) {
        console.log("Error reading file:", err);
        return res
          .status(500)
          .json({ status: "error", message: "Failed to read file" });
      }

      let todos = [];
      // Parse existing todos if there is data in the file
      if (data) {
        try {
          todos = JSON.parse(data);
        } catch (parseErr) {
          console.log("Error parsing JSON:", parseErr);
          return res
            .status(500)
            .json({ status: "error", message: "Failed to parse JSON" });
        }
      }

      // Add the new todo to the array
      todos.push(newtodo);

      // Write the updated array back to the file
      fs.writeFile(
        "./file.json",
        JSON.stringify(todos, null, 2),
        (writeErr) => {
          if (writeErr) {
            console.log("Error writing file:", writeErr);
            return res
              .status(500)
              .json({ status: "error", message: "Failed to write file" });
          }
          return res.json({ status: "success" });
        }
      );
    });
  } else {
    res.status(400).json({ status: "error", message: "Message is required" });
  }
});

//deleting from file
app.delete("/api/deletetodo/:id", (req, res) => {
  const id = req.params.id;
  console.log("Deleting item with ID:", id);

  fs.readFile("./file.json", "utf8", (err, data) => {
    if (err) {
      console.log("Error reading file:", err);
      return res
        .status(500)
        .json({ status: "error", message: "Failed to read file" });
    }

    let todos;
    if (data) {
      try {
        todos = JSON.parse(data);

        // Filter out the task with the specified ID
        const newTodos = todos.filter((todo) => todo.id !== parseInt(id));

        // Write the updated list back to the file
        fs.writeFile(
          "./file.json",
          JSON.stringify(newTodos, null, 2),
          (writeErr) => {
            if (writeErr) {
              console.log("Error writing file:", writeErr);
              return res
                .status(500)
                .json({ status: "error", message: "Failed to update file" });
            }

            // Send a success response after deletion
            return res.json({
              status: "success",
              message: "Todo deleted successfully",
            });
          }
        );
      } catch (parseErr) {
        console.log("Error parsing JSON:", parseErr);
        return res
          .status(500)
          .json({ status: "error", message: "Failed to parse JSON" });
      }
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "Todo not found" });
    }
  });
});

//modifying from todo
app.patch("/api/modifytodo/:id", (req, res) => {
  const id = req.params.id;
  const { newtask } = req.body;

  // Read the JSON file
  fs.readFile("./file.json", "utf8", (err, data) => {
    if (err) {
      console.log("Error reading file:", err);
      return res
        .status(500)
        .json({ status: "error", message: "Failed to read file" });
    }

    let todos;
    if (data) {
      try {
        // Parse the file data to JSON
        todos = JSON.parse(data);

        // Find the index of the todo to modify
        const todoIndex = todos.findIndex((todo) => todo.id === parseInt(id));
        if (todoIndex === -1) {
          // If no todo found with the given ID, send a 404 response
          return res
            .status(404)
            .json({ status: "error", message: "Todo not found" });
        }

        // Update the todo item with the new task message
        todos[todoIndex].message = newtask;

        // Write the updated todos array back to the JSON file
        fs.writeFile(
          "./file.json",
          JSON.stringify(todos, null, 2),
          (writeErr) => {
            if (writeErr) {
              console.log("Error writing file:", writeErr);
              return res
                .status(500)
                .json({ status: "error", message: "Failed to update file" });
            }

            // Send a success response after updating
            return res.json({
              status: "success",
              message: "Todo modified successfully",
            });
          }
        );
      } catch (parseErr) {
        console.log("Error parsing JSON:", parseErr);
        return res
          .status(500)
          .json({ status: "error", message: "Failed to parse JSON" });
      }
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "No todos found" });
    }
  });
});
app.listen(PORT, () => {
  console.log("Server started successfully");
});
