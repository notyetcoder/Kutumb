'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RelationshipFinderClient from './_components/RelationshipFinderClient';

export default function RelationshipsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            🌳 Relationship Finder
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Discover how two people in our community are connected
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>👥</span> Easy to Use
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600">
              Simply select any two people and instantly discover their relationship.
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>🔗</span> Accurate Results
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600">
              Our algorithm finds the shortest path between any two community members.
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>📊</span> Visual Paths
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600">
              See the complete connection path with pictures and relationships.
            </CardContent>
          </Card>
        </div>

        {/* Main Finder */}
        <RelationshipFinderClient />
      </div>
    </div>
  );
}
