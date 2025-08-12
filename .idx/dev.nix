{ pkgs, ... }: {
  # pick a channel that contains a recent ollama; "unstable" usually has latest
  channel = "unstable"; 

  packages = [
    pkgs.ollama
    pkgs.bun
    pkgs.curl
  ];

  env = {
    OLLAMA_HOST = "0.0.0.0:11434";
  };
  
  idx = {
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["bun" "run" "./server/index.ts"];
          manager = "web";
          env = {
            PORT = "$PORT";
          };
        };
      };
    };
    workspace = {
      onCreate = {
        bun-install = "bun i";
      };
      onStart = {
        ollamaServe = "nohup ollama serve > .idx/ollama.log 2>&1 &";
        pullGemma   = "bash -lc 'sleep 5 && ollama pull gemma3:1b || true'";
      };
    };
  };
}
