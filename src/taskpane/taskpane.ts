/* global Word console */

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

export async function getDocumentText(): Promise<string> {
    const res = await Word.run(async (context) => {
      const body = context.document.body;
      body.load("text");
      await context.sync();
      return body.text;
    })
    return res;
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
