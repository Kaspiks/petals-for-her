import { useState, useEffect, useRef, useCallback } from "react";
import { createConsumer } from "@rails/actioncable";

const TOKEN_KEY = "petals_jwt";

function getCableUrl() {
  const token = localStorage.getItem(TOKEN_KEY);
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host;
  return `${protocol}//${host}/cable?token=${encodeURIComponent(token || "")}`;
}