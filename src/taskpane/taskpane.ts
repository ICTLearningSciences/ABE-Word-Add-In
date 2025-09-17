/* global Word console */

import { DocData } from "../src/hook/use-with-doc-versioning";

export async function insertText(text: string) {
  // Write text to the document.
  try {
    await Word.run(async (context) => {
      let body = context.document.body;
      body.insertParagraph(text, Word.InsertLocation.end);
      await context.sync();
    });
  } catch (error) {
    console.log("Error: " + error);
  }
}

export async function getDocumentText(userId: string): Promise<DocData> {
    const text = await Word.run(async (context) => {
      const body = context.document.body;
      body.load("text");
      await context.sync();
      return body.text;
    })
    const title = await Word.run(async (context) => {
      const properties = context.document.properties;
      properties.load("title");
      await context.sync();
      return properties.title;
    })
    return {
      plainText: text,
      markdownText: text,
      lastChangedId: "",
      title: title,
      lastModifyingUser: userId,
      modifiedTime: new Date().toISOString(),
  };
}

export async function getCreationDate() {
  const res = await Word.run(async (context) => {
    const properties = context.document.properties;
    properties.load("creationDate");
    await context.sync();
    return properties.creationDate;
  })
  return res;
}

export async function getDocumentCustomProperties() {
  const res = await Word.run(async (context) => {
    const properties = context.document.properties;
    properties.load("customProperties");
    await context.sync();
    return properties.customProperties;
  })
  return res;
}