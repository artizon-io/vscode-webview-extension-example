{
  description = "An impure flake for developing on this vscode extension";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-23.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }: flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs {
        inherit system;
      };
    in
    {
      devShells = rec {
        develop = pkgs.mkShell rec {
          nativeBuildInputs = with pkgs; [
            nodejs_20
          ];
        };
        default = develop;
      };
    }
  );
}