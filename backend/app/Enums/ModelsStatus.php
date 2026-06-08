<?php

namespace App\Enums;

enum ModelsStatus: int
{
    case Inactive = 0;
    case Active = 1;
    case Pending = 2;
    case Suspended = 3;
    case Rejected = 4;
    case Validating = 5;
    case Payment = 6;
    case Deleted = 7; // Soft delete
    case Unknown = 10;
    case Completed = 11;
    case Cancelled = 12;

    // Return array of all labels
    public static function values(): array
    {
        return array_map(fn($status) => $status->label(), self::cases());
    }

    public function label(): string
    {
        return match ($this) {
            self::Inactive => 'inactive',
            self::Active => 'active',
            self::Pending => 'pending',
            self::Suspended => 'suspended',
            self::Rejected => 'rejected',
            self::Validating => 'validating',
            self::Payment => 'payment',
            self::Deleted => 'deleted',
            self::Unknown => 'unknown',
            self::Completed => 'completed',
            self::Cancelled => 'cancelled',
            default => 'unknown',
        };
    }

    public static function fromLabel(string $label): self
    {
        return match (strtolower($label)) {
            'inactive' => self::Inactive,
            'active' => self::Active,
            'pending' => self::Pending,
            'suspended' => self::Suspended,
            'rejected' => self::Rejected,
            'validating' => self::Validating,
            'payment' => self::Payment,
            'deleted' => self::Deleted,
            'unknown' => self::Unknown,
            'completed' => self::Completed,
            'cancelled' => self::Cancelled,
            default => self::Unknown,
        };
    }
}
