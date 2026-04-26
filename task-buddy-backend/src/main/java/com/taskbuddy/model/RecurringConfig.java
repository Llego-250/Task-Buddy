package com.taskbuddy.model;

public class RecurringConfig {
    private boolean enabled = false;
    private String type = "daily";
    private int interval = 1;

    public RecurringConfig() {}

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public int getInterval() { return interval; }
    public void setInterval(int interval) { this.interval = interval; }
}
