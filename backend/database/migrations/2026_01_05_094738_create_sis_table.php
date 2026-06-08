<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('specialties', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique()->comment('Nome da especialidade médica');
            $table->text('description')->nullable()->comment('Descrição da especialidade');
            $table->unsignedTinyInteger('status')->default(1)->index()->comment('0=Inativo, 1=Ativo');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('medical_staff', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('specialty_id')->constrained()->onDelete('cascade');
            $table->string('license_number')->unique()->comment('Número da cédula profissional');
            $table->json('schedule')->nullable()->comment('Horário de atendimento');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('medical_records', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade')->comment('Utente');
            $table->string('record_number')->unique()->comment('Número do RCU');
            
            // Dados médicos fixos
            $table->enum('gender', ['masculino', 'feminino', 'outro'])->nullable();
            $table->string('blood_type')->nullable()->comment('Grupo sanguíneo');
            $table->json('allergies')->nullable()->comment('Alergias');
            
            // Dados pessoais relevantes para saúde
            $table->json('family_health_history')->nullable()->comment('História familiar de saúde');
            $table->json('vaccination_record')->nullable()->comment('Boletim de vacinas');
            
            // Informação de seguro
            $table->string('insurance_company')->nullable()->comment('Entidade financeira responsável');
            $table->string('insurance_number')->nullable()->comment('Número de utente na entidade');
            
            $table->unsignedTinyInteger('status')->default(1)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('appointments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade')->comment('Utente');
            $table->foreignUuid('medical_staff_id')->references('id')->on('medical_staff')->onDelete('cascade')->comment('Médico');
            $table->foreignUuid('specialty_id')->constrained()->onDelete('cascade');
            $table->string('appointment_number')->unique();
            $table->dateTime('appointment_date')->index();
            $table->enum('type', ['consulta', 'exame'])->default('consulta');
            $table->string('exam_type')->nullable()->comment('Tipo de exame se aplicável');
            $table->text('reason')->nullable()->comment('Motivo da consulta');
            $table->enum('status', ['agendada', 'confirmada', 'realizada', 'cancelada'])->default('agendada')->index();
            $table->text('notes')->nullable()->comment('Observações');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('consultations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('appointment_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('medical_record_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('medical_staff_id')->references('id')->on('medical_staff')->onDelete('cascade');
            $table->text('symptoms')->nullable()->comment('Sintomas relatados');
            $table->text('diagnosis')->nullable()->comment('Diagnóstico');
            $table->json('procedures')->nullable()->comment('Procedimentos realizados');
            $table->json('prescriptions')->nullable()->comment('Prescrições médicas');
            $table->text('observations')->nullable()->comment('Observações médicas');
            $table->boolean('is_public')->default(true)->comment('Visível para o utente');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('exam_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->boolean('requires_prescription')->default(true)->comment('Requer prescrição médica');
            $table->unsignedTinyInteger('status')->default(1)->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_types');
        Schema::dropIfExists('consultations');
        Schema::dropIfExists('medical_staff');
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('medical_records');
        Schema::dropIfExists('specialties');
    }
};
