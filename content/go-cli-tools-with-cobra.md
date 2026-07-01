---
title: "Building CLI Tools in Go with Cobra"
description: "Notes on structuring a Go CLI project using the Cobra library."
category: "Go Programming"
tags: ["go", "cli", "cobra"]
date: "2026-03-01"
---

## Why Cobra

Cobra gives you subcommands, flags, and help text generation for free -
useful once a CLI grows past a single `main.go` with a giant `switch`
statement.

## Basic Project Layout

```text
mytool/
├── cmd/
│   ├── root.go
│   ├── scan.go
│   └── report.go
├── internal/
│   └── scanner/
└── main.go
```

## Root Command

```go
package cmd

import (
    "fmt"
    "os"

    "github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
    Use:   "mytool",
    Short: "mytool is a small recon helper",
    Run: func(cmd *cobra.Command, args []string) {
        fmt.Println("Run mytool --help to see available commands")
    },
}

func Execute() {
    if err := rootCmd.Execute(); err != nil {
        fmt.Fprintln(os.Stderr, err)
        os.Exit(1)
    }
}
```

## Adding a Subcommand

```go
package cmd

import "github.com/spf13/cobra"

var target string

var scanCmd = &cobra.Command{
    Use:   "scan",
    Short: "Run a scan against a target",
    Run: func(cmd *cobra.Command, args []string) {
        runScan(target)
    },
}

func init() {
    scanCmd.Flags().StringVarP(&target, "target", "t", "", "target host")
    rootCmd.AddCommand(scanCmd)
}
```

## Takeaways

- Keep business logic in `internal/`, not inside the `cmd/` files - it makes
  the CLI layer easy to test in isolation.
- Cobra pairs well with Viper if you also want config file + env var support.
