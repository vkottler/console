/*
 * Just to a test to see if our JSX integration is working.
 */
const message = "Hello, world!!!";
export const test_elem = (
  <div>
    {message}
    <div style="display: grid; background: orange; width: 50%; grid-template-columns: auto auto auto">
      <div style="background: red">1</div>
      <div style="background: green">2</div>
      <div style="background: blue">3</div>
      <div style="background: red">4</div>
      <div style="background: green">5</div>
      <div style="background: blue">6</div>
      <div style="background: red">7</div>
      <div style="background: green">8</div>
      <div style="background: blue">9</div>
    </div>
  </div>
);
