<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Widget-test</title>
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Open+Sans&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Open Sans', sans-serif;
      background-color: #FDF9ED;
      color: #333333;
      margin: 20px;
    }
    h1 {
      font-family: 'Archivo Black', sans-serif;
      text-align: left; /* <-- ändrat från center till vänster */
      font-size: 2.2em;
    }
  </style>
</head>
<body>
  <h1>Widget-test</h1>

  <script 
    src="https://aeonnull.github.io/agentbyran-astrid/agentbyran-widget.js"
    data-company="Demo Företaget"
    data-agent="säljare"
    data-endpoint="https://agentbyran-proxy.onrender.com/ask"
    data-color="#333333"
    data-position="bottom-right">
  </script>
</body>
</html>
