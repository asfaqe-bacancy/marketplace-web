"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import Button from "@/components/ui/Button";
import ProtectedRoute from "@/components/ProtectedRoute";
import { styles } from "./styles";

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className={styles.container}>
          <h1 className={styles.heading}>Settings</h1>

          <div className={styles.card}>
            <div className={styles.sectionContainer}>
              <h2 className={styles.sectionHeading}>Account Information</h2>
              <div className={styles.fieldContainer}>
                <div>
                  <p className={styles.fieldLabel}>Name</p>
                  <p className={styles.fieldValue}>{user?.name}</p>
                </div>
                <div>
                  <p className={styles.fieldLabel}>Email</p>
                  <p className={styles.fieldValue}>{user?.email}</p>
                </div>
              </div>
            </div>

            <div className={styles.divider}>
              <h2 className={styles.sectionHeading}>Account Actions</h2>
              <div className={styles.actionContainer}>
                <Button
                  variant="outline"
                  className={styles.button.danger}
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
