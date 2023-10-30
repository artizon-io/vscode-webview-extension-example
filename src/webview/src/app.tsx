import React from "react";

const App = () => {
  const onMessage = (e: MessageEvent<any>) => {
    const { type, payload } = e.data;
    switch (type) {
    }
  };

  return <h1>Example</h1>;
};

export default App;
