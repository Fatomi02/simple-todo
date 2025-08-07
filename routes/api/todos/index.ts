import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { ObjectId } from "npm:mongodb";
import { db } from "../../../utils/dbConnection.ts";

const TodoCollection = db.collection("todos");


export const handler: Handlers = {
  async POST(_req, _ctx) {
    try {
      const { todo } = await _req.json();
      if (!todo) {
        return new Response("Invalid request data", {
          status: STATUS_CODE.BadRequest,
        });
      }
      await TodoCollection.insertOne({ todo: todo, completed: false });
      return new Response(null, {
        status: STATUS_CODE.Created,
        statusText: "Todo added successfully",
      });
    } catch (error) {
      console.error("Error adding todo:", error);
      return new Response(String(error));
    }
  },

  async GET(_req, _ctx) {
    try {
      const todos = await TodoCollection.find().toArray();
      return new Response(JSON.stringify(todos), {
        status: STATUS_CODE.OK,
        statusText: "Todos fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching todos:", error);
      return new Response(String(error));
    }
  },

  async PUT(_req, _ctx) {
    try {
      const { id, text } = await _req.json();
      if (!id || !text) {
        return new Response("Invalid request data", {
          status: STATUS_CODE.BadRequest,
        });
      }
      await TodoCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { todo: text } }
      );
      return new Response(null, {
        status: STATUS_CODE.OK,
        statusText: "Todo updated successfully",
      });
    } catch (error) {
      return new Response(String(error));
    }
  },

  async DELETE(_req, _ctx) {
    try {
      const { id } = await _req.json();
      if (!id) {
        return new Response("Invalid request data", {
          status: STATUS_CODE.BadRequest,
        });
      }
      await TodoCollection.deleteOne({ _id: new ObjectId(id) });
      return new Response(null, {
        status: STATUS_CODE.OK,
      });
    } catch (error) {
      throw new Error(String(error));
    }
  },

  async PATCH(_req, _ctx) {
    try {
      const { id, completed } = await _req.json();
      if (!id || !completed) {
        return new Response("Invalid request data", {
          status: STATUS_CODE.BadRequest,
        });
      }
      await TodoCollection.updateOne(
        { _id: new ObjectId(id)},
        { $set: { completed: completed}}
      )
      return new Response(null, {
        status: STATUS_CODE.OK,
        statusText: "Todo completed successfully",
      });
    } catch (error) {
      throw new Error(String(error));
    }
  },
};
