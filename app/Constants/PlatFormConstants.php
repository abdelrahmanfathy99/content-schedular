<?php

namespace App\Constants;
use App\Traits\ConstantsTrait;

enum PlatFormConstants: int
{
    use ConstantsTrait;

    case FACEBOOK = 1;
    case INSTAGRAM = 2;
    case TWITTER = 3;
    case LINKEDIN = 4;

    public static function getLabels($value): string
    {
        return match ($value) {
            self::FACEBOOK => 'Facebook',
            self::INSTAGRAM => 'Instagram',
            self::TWITTER => 'Twitter',
            self::LINKEDIN => 'Linkedin',
        };
    }

    public function label(): string
    {
        return self::getLabels($this);
    }
}
