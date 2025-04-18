package com.cs5224.ipos.ai.context;

public class VoyagerTokenContext {
    private static final ThreadLocal<Integer> tokenCount = new ThreadLocal<>();

    public static void setTokenCount(int count) {
        tokenCount.set(count);
    }

    public static int getTokenCount() {
        return tokenCount.get();
    }

    public static void clear() {
        tokenCount.remove();
    }
}
